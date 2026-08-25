from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base_class import Base


class Enumerator(Base):
    __tablename__ = "enumerators"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="Field Enumerator")
    zone_id: Mapped[Optional[str]] = mapped_column(String(50), ForeignKey("zones.id", ondelete="SET NULL"), nullable=True, index=True)
    ward: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    district: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    mobile: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    daily_target: Mapped[int] = mapped_column(Integer, default=20)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    zone: Mapped[Optional["Zone"]] = relationship("Zone", back_populates="enumerators")
    households: Mapped[List["Household"]] = relationship("Household", back_populates="enumerator")
