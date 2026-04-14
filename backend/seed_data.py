from app.database import Base, SessionLocal, engine
from app.models import Route, Station
from sqlalchemy import and_, or_

Base.metadata.create_all(bind=engine)

stations = [
    "Delhi",
    "Ghaziabad",
    "Meerut",
    "Muzaffarnagar",
    "Roorkee",
    "Jaipur",
    "Mumbai",
    "Ahmedabad",
    "Bhopal",
    "Lucknow",
    "Kolkata",
    "Chandigarh",
    "Amritsar",
    "Jammu",
    "Dehradun",
    "Kanpur",
    "Patna",
    "Ranchi",
    "Bhubaneswar",
    "Nagpur",
    "Pune",
    "Surat",
    "Vadodara",
    "Indore",
    "Hyderabad",
    "Bengaluru",
    "Chennai",
    "Vijayawada",
    "Kochi",
    "Thiruvananthapuram",
]

routes = [
    ("Delhi", "Jaipur", 280),
    ("Jaipur", "Ahmedabad", 670),
    ("Ahmedabad", "Mumbai", 530),
    ("Delhi", "Lucknow", 550),
    ("Lucknow", "Bhopal", 620),
    ("Bhopal", "Mumbai", 780),
    ("Delhi", "Bhopal", 740),
    ("Delhi", "Kolkata", 1500),
    ("Kolkata", "Mumbai", 1960),
    ("Jaipur", "Mumbai", 1140),
    ("Delhi", "Chandigarh", 250),
    ("Chandigarh", "Amritsar", 230),
    ("Amritsar", "Jammu", 215),
    # Detailed Delhi -> Dehradun corridor with intermediate stations.
    ("Delhi", "Ghaziabad", 25),
    ("Ghaziabad", "Meerut", 65),
    ("Meerut", "Muzaffarnagar", 60),
    ("Muzaffarnagar", "Roorkee", 55),
    ("Roorkee", "Dehradun", 55),
    ("Delhi", "Kanpur", 440),
    ("Kanpur", "Lucknow", 90),
    ("Lucknow", "Patna", 520),
    ("Patna", "Ranchi", 330),
    ("Ranchi", "Kolkata", 410),
    ("Kolkata", "Bhubaneswar", 440),
    ("Bhubaneswar", "Vijayawada", 820),
    ("Vijayawada", "Chennai", 450),
    ("Chennai", "Bengaluru", 350),
    ("Bengaluru", "Hyderabad", 570),
    ("Hyderabad", "Nagpur", 500),
    ("Nagpur", "Bhopal", 350),
    ("Nagpur", "Mumbai", 840),
    ("Mumbai", "Pune", 150),
    ("Pune", "Hyderabad", 560),
    ("Mumbai", "Surat", 280),
    ("Surat", "Vadodara", 130),
    ("Vadodara", "Ahmedabad", 110),
    ("Indore", "Bhopal", 190),
    ("Indore", "Vadodara", 420),
    ("Chennai", "Kochi", 680),
    ("Kochi", "Thiruvananthapuram", 210),
]


def seed() -> None:
    db = SessionLocal()
    try:
        station_map: dict[str, Station] = {station.name: station for station in db.query(Station).all()}

        for station_name in stations:
            if station_name not in station_map:
                station = Station(name=station_name)
                db.add(station)
                station_map[station_name] = station
        db.flush()

        for source_name, destination_name, distance in routes:
            source_id = station_map[source_name].id
            destination_id = station_map[destination_name].id
            exists = (
                db.query(Route)
                .filter(
                    or_(
                        and_(Route.source_id == source_id, Route.destination_id == destination_id),
                        and_(Route.source_id == destination_id, Route.destination_id == source_id),
                    )
                )
                .first()
            )
            if not exists:
                db.add(
                    Route(
                        source_id=source_id,
                        destination_id=destination_id,
                        distance=distance,
                    )
                )

        db.commit()
        print("Seed data synced successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
