import heapq


def dijkstra(
    graph: dict[str, list[tuple[str, float]]],
    source: str,
    destination: str,
    blocked_edge: tuple[str, str] | None = None,
) -> tuple[list[str], float]:
    # Priority queue stores (distance_so_far, current_station, path_so_far)
    queue: list[tuple[float, str, list[str]]] = [(0.0, source, [source])]
    visited: dict[str, float] = {}

    while queue:
        distance, current, path = heapq.heappop(queue)

        if current in visited and visited[current] <= distance:
            continue
        visited[current] = distance

        if current == destination:
            return path, distance

        for neighbor, edge_distance in graph.get(current, []):
            if blocked_edge and _is_blocked_edge(current, neighbor, blocked_edge):
                continue
            new_distance = distance + edge_distance
            if neighbor not in visited or new_distance < visited[neighbor]:
                heapq.heappush(queue, (new_distance, neighbor, path + [neighbor]))

    return [], float("inf")


def find_second_best_path(
    graph: dict[str, list[tuple[str, float]]],
    best_path: list[str],
    source: str,
    destination: str,
) -> tuple[list[str], float]:
    candidate_paths: list[tuple[list[str], float]] = []

    for idx in range(len(best_path) - 1):
        edge = (best_path[idx], best_path[idx + 1])
        path, dist = dijkstra(graph, source, destination, blocked_edge=edge)
        if path and dist != float("inf") and path != best_path:
            candidate_paths.append((path, dist))

    if not candidate_paths:
        return [], float("inf")

    return min(candidate_paths, key=lambda item: item[1])


def _is_blocked_edge(current: str, neighbor: str, blocked: tuple[str, str]) -> bool:
    a, b = blocked
    return (current == a and neighbor == b) or (current == b and neighbor == a)
