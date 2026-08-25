from datetime import datetime
from typing import Optional, List
from sqlalchemy import String, Integer, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.app.db.base_class import Base


class Zone(Base):
    __tablename__ = "zones"

    id: Mapped[str] = mapped_column(String(50), primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    ward: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    sub_area: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    district: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    total_households: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    enumerators: Mapped[List["Enumerator"]] = relationship("Enumerator", back_populates="zone")
    households: Mapped[List["Household"]] = relationship("Household", back_populates="zone")
