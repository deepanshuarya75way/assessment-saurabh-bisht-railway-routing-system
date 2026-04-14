from pydantic import BaseModel


class RouteOption(BaseModel):
    route_type: str
    path: list[str]
    total_distance_km: float
    estimated_time_hours: float
    estimated_fare: float


class RouteResponse(BaseModel):
    source: str
    destination: str
    routes: list[RouteOption]
    shortest_path: list[str] | None = None
    total_distance_km: float | None = None
    estimated_time_hours: float | None = None
    estimated_fare: float | None = None
    second_best_path: list[str] | None = None
    second_best_distance_km: float | None = None


class StationResponse(BaseModel):
    id: int
    name: str


class RouteListResponse(BaseModel):
    id: int
    source_id: int
    destination_id: int
    source_name: str
    destination_name: str
    distance: float
