from datetime import datetime
from typing import Optional
from sqlalchemy import String, Integer, DateTime, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base_class import Base


class Household(Base):
    __tablename__ = "households"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    household_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    head_name: Mapped[str] = mapped_column(String(100), nullable=False)
    locality: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    ward: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    district: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    members_count: Mapped[int] = mapped_column(Integer, default=1)
    status: Mapped[str] = mapped_column(String(50), default="Pending", index=True)
    priority: Mapped[str] = mapped_column(String(20), default="Normal")

    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    enumerator_id: Mapped[Optional[str]] = mapped_column(String(50), ForeignKey("enumerators.id", ondelete="SET NULL"), nullable=True, index=True)
    zone_id: Mapped[Optional[str]] = mapped_column(String(50), ForeignKey("zones.id", ondelete="SET NULL"), nullable=True, index=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    enumerator: Mapped[Optional["Enumerator"]] = relationship("Enumerator", back_populates="households")
    zone: Mapped[Optional["Zone"]] = relationship("Zone", back_populates="households")
