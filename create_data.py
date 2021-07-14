from db.models import engine, db_session, Base, Skill, Staff, Experience, Staff_password
from datetime import datetime
import bcrypt

Base.metadata.create_all(bind=engine)

staff1 = Staff(name="Pelle", contact_info="pelle#1234", contact_type="discord", username="pelle123")
staff2 = Staff(name="Lisa", contact_info="1234-5678-90", contact_type="phone", username="lisa123")
staff3 = Staff(name="Jonas", contact_info="jonas@mail.com", contact_type="email", username="jonas@mail.com")
db_session.add(staff1)
db_session.add(staff2)
db_session.add(staff3)

p1 = b"Hejsan123"
p1_hash = bcrypt.hashpw(p1, bcrypt.gensalt())
password1 = Staff_password(password=p1_hash, staff=staff1)

p2 = b"Hejsan123"
p2_hash = bcrypt.hashpw(p2, bcrypt.gensalt())
password2 = Staff_password(password=p2_hash, staff=staff2)

p3 = b"Hejsan123"
p3_hash = bcrypt.hashpw(p3, bcrypt.gensalt())
password3 = Staff_password(password=p3_hash, staff=staff3)

db_session.add(password1)
db_session.add(password2)
db_session.add(password3)

skill1 = Skill(staff=staff1, name="Pick Ban", description="Good at analyzing och doing pick ban", reference="https://www.youtube.com/watch?v=dQw4w9WgXcQ")
skill2 = Skill(staff=staff1, name="Top lane matchups", description="Good at top lane matchups, tanks", reference="https://www.youtube.com/watch?v=dQw4w9WgXcQ")
skill3 = Skill(staff=staff2, name="Pick Ban", description="Good att analyzing och doing pick ban", reference="https://www.youtube.com/watch?v=dQw4w9WgXcQ")
db_session.add(skill1)
db_session.add(skill2)
db_session.add(skill3)

experience1 = Experience(type="Coach", description="Head coach, focus in team morale", at="Pepega Gaming", reference="1234-5678-90", start=datetime(2020, 1, 1), end=datetime(2021, 1, 1), staff=staff2)
experience2 = Experience(type="Analyst", description="Analyst, focus on LPL", at="Pepega Gaming", reference="1234-5678-90", start=datetime(2020, 1, 1), end=datetime(2021, 1, 1), staff=staff3)
experience3 = Experience(type="Assistant coach", description="Assistant coach, focus one to one relationships", at="Pepega Gaming", reference="1234-5678-90", start=datetime(2021, 1, 1), staff=staff1)

db_session.add(experience1)
db_session.add(experience2)
db_session.add(experience3)

db_session.commit()
