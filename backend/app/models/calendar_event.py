from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class CalendarEventManual(Base):
    __tablename__ = "calendar_events_manual"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    date = Column(Date, nullable=False)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)

    user = relationship("User")
