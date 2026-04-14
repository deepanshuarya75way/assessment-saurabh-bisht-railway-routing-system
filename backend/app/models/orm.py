from sqlalchemy import Column, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from ..database.connection import Base


class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False, index=True)


class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, ForeignKey("stations.id"), nullable=False)
    destination_id = Column(Integer, ForeignKey("stations.id"), nullable=False)
    distance = Column(Float, nullable=False)

    source = relationship("Station", foreign_keys=[source_id])
    destination = relationship("Station", foreign_keys=[destination_id])
