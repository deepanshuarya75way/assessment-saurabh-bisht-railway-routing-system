from sqlalchemy.orm import Session, aliased

from ..models.orm import Route, Station


def get_all_stations(db: Session) -> list[Station]:
    return db.query(Station).order_by(Station.name.asc()).all()


def get_station_by_name(db: Session, station_name: str) -> Station | None:
    return db.query(Station).filter(Station.name == station_name).first()


def get_all_routes(db: Session) -> list[dict]:
    source_alias = aliased(Station)
    destination_alias = aliased(Station)

    rows = (
        db.query(
            Route.id,
            Route.source_id,
            Route.destination_id,
            Route.distance,
            source_alias.name.label("source_name"),
            destination_alias.name.label("destination_name"),
        )
        .join(source_alias, Route.source_id == source_alias.id)
        .join(destination_alias, Route.destination_id == destination_alias.id)
        .order_by(Route.id.asc())
        .all()
    )

    return [
        {
            "id": row.id,
            "source_id": row.source_id,
            "destination_id": row.destination_id,
            "distance": row.distance,
            "source_name": row.source_name,
            "destination_name": row.destination_name,
        }
        for row in rows
    ]
