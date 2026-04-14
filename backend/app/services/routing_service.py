import logging

from fastapi import HTTPException
from sqlalchemy.orm import Session

from ..database.queries import get_all_routes, get_all_stations, get_station_by_name
from .dijkstra import dijkstra, find_second_best_path

AVERAGE_SPEED_KMPH = 60.0
FARE_PER_KM = 1.75

logger = logging.getLogger(__name__)

# Optional detailed station chains for major graph edges.
# When a Dijkstra path contains one of these edges, we expand it into all
# intermediate stations before returning the API response.
DETAILED_SEGMENTS: dict[tuple[str, str], list[str]] = {
    ("Delhi", "Dehradun"): [
        "Delhi",
        "Ghaziabad",
        "Meerut",
        "Muzaffarnagar",
        "Roorkee",
        "Dehradun",
    ],
    ("Delhi", "Chandigarh"): ["Delhi", "Panipat", "Kurukshetra", "Ambala", "Chandigarh"],
    ("Chandigarh", "Amritsar"): ["Chandigarh", "Ludhiana", "Jalandhar", "Amritsar"],
    ("Amritsar", "Jammu"): ["Amritsar", "Pathankot", "Kathua", "Jammu"],
    ("Delhi", "Kanpur"): ["Delhi", "Ghaziabad", "Aligarh", "Etawah", "Kanpur"],
    ("Kanpur", "Lucknow"): ["Kanpur", "Unnao", "Lucknow"],
    ("Lucknow", "Patna"): ["Lucknow", "Sultanpur", "Varanasi", "Buxar", "Ara", "Patna"],
    ("Patna", "Ranchi"): ["Patna", "Gaya", "Koderma", "Ranchi"],
    ("Ranchi", "Kolkata"): ["Ranchi", "Dhanbad", "Asansol", "Kolkata"],
    ("Mumbai", "Pune"): ["Mumbai", "Lonavala", "Pune"],
    ("Mumbai", "Surat"): ["Mumbai", "Vapi", "Navsari", "Surat"],
    ("Surat", "Vadodara"): ["Surat", "Bharuch", "Anand", "Vadodara"],
    ("Vadodara", "Ahmedabad"): ["Vadodara", "Nadiad", "Ahmedabad"],
}


def compute_route(db: Session, source_name: str, destination_name: str) -> dict:
    source_name = source_name.strip()
    destination_name = destination_name.strip()

    source_station = get_station_by_name(db, source_name)
    dest_station = get_station_by_name(db, destination_name)

    if not source_station or not dest_station:
        logger.warning(
            "Station validation failed for source='%s', destination='%s'",
            source_name,
            destination_name,
        )
        raise HTTPException(status_code=404, detail="Source or destination station not found.")
    if source_station.name == dest_station.name:
        logger.warning("Source and destination are the same: '%s'", source_name)
        raise HTTPException(status_code=400, detail="Source and destination cannot be the same.")

    graph = build_graph(db)
    shortest_path, distance = dijkstra(graph, source_name, destination_name)

    if not shortest_path or distance == float("inf"):
        logger.warning("No route found for source='%s', destination='%s'", source_name, destination_name)
        raise HTTPException(status_code=404, detail="No route available between the given stations.")

    second_path, second_dist = find_second_best_path(
        graph, shortest_path, source_name, destination_name
    )

    route_options = [
        _format_route_option("shortest", shortest_path, distance),
    ]
    if second_path and second_dist != float("inf"):
        route_options.append(_format_route_option("alternative", second_path, second_dist))

    shortest = route_options[0]
    alternative = route_options[1] if len(route_options) > 1 else None

    return {
        "source": source_name,
        "destination": destination_name,
        "routes": route_options,
        # Backward-compatible fields for existing frontend integrations.
        "shortest_path": shortest["path"],
        "total_distance_km": shortest["total_distance_km"],
        "estimated_time_hours": shortest["estimated_time_hours"],
        "estimated_fare": shortest["estimated_fare"],
        "second_best_path": alternative["path"] if alternative else None,
        "second_best_distance_km": alternative["total_distance_km"] if alternative else None,
    }


def build_graph(db: Session) -> dict[str, list[tuple[str, float]]]:
    graph: dict[str, list[tuple[str, float]]] = {}

    station_names = [s.name for s in get_all_stations(db)]
    for name in station_names:
        graph[name] = []

    routes = get_all_routes(db)
    for route in routes:
        source_name = route["source_name"]
        destination_name = route["destination_name"]
        distance = route["distance"]
        # We treat rail routes as bidirectional.
        graph[source_name].append((destination_name, distance))
        graph[destination_name].append((source_name, distance))

    return graph


def get_station_list(db: Session) -> list[str]:
    stations = get_all_stations(db)
    return [station.name for station in stations]


def get_route_list(db: Session) -> list[dict]:
    return get_all_routes(db)


def _format_route_option(route_type: str, path: list[str], distance: float) -> dict:
    expanded_path = _expand_path(path)
    return {
        "route_type": route_type,
        "path": expanded_path,
        "total_distance_km": round(distance, 2),
        "estimated_time_hours": round(distance / AVERAGE_SPEED_KMPH, 2),
        "estimated_fare": round(distance * FARE_PER_KM, 2),
    }


def _expand_path(path: list[str]) -> list[str]:
    if len(path) < 2:
        return path

    expanded: list[str] = [path[0]]
    for idx in range(len(path) - 1):
        source = path[idx]
        destination = path[idx + 1]
        segment = _get_detailed_segment(source, destination)
        expanded.extend(segment[1:])
    return expanded


def _get_detailed_segment(source: str, destination: str) -> list[str]:
    forward = DETAILED_SEGMENTS.get((source, destination))
    if forward:
        return forward

    reverse = DETAILED_SEGMENTS.get((destination, source))
    if reverse:
        return list(reversed(reverse))

    return [source, destination]
