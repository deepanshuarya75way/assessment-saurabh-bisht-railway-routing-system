import logging

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ..database.connection import get_db
from ..models.schemas import RouteResponse
from ..services.routing_service import compute_route

router = APIRouter(prefix="/route", tags=["Routing"])
logger = logging.getLogger(__name__)


@router.get("", response_model=RouteResponse)
def get_route(
    source: str = Query(..., min_length=2),
    destination: str = Query(..., min_length=2),
    db: Session = Depends(get_db),
):
    logger.info("Route API called: source='%s', destination='%s'", source, destination)
    return compute_route(db, source, destination)
