import logging

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database.connection import get_db
from ..models.schemas import RouteListResponse
from ..services.routing_service import get_route_list, get_station_list

router = APIRouter(tags=["Railway Data"])
logger = logging.getLogger(__name__)


@router.get("/stations", response_model=list[str])
def list_stations(db: Session = Depends(get_db)):
    logger.info("Stations API called")
    return get_station_list(db)


@router.get("/routes", response_model=list[RouteListResponse])
def list_routes(db: Session = Depends(get_db)):
    logger.info("Routes API called")
    return get_route_list(db)
