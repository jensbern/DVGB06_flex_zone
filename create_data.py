from db.models import (
    Interest,
    engine,
    db_session,
    Base,
    Skill,
    Staff,
    Experience,
    Staff_password,
    Reference,
)
from datetime import datetime
import bcrypt

Base.metadata.create_all(bind=engine)

staff1 = Staff(
    name="Pelle", contact_info="pelle#1234", contact_type="discord", username="pelle123"
)
staff2 = Staff(
    name="Lisa", contact_info="1234-5678-90", contact_type="phone", username="lisa123"
)
staff3 = Staff(
    name="Jonas",
    contact_info="jonas@mail.com",
    contact_type="email",
    username="jonas@mail.com",
)
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

interest1 = Interest(owner=staff1, to=staff2)

db_session.add(interest1)

skill1 = Skill(
    staff=staff1,
    name="Pick Ban",
    description="Good at analyzing och doing pick ban",
)

ref1 = Reference(ref_type="link", link="https://www.google.com/")
ref2 = Reference(ref_type="link", link="https://www.twitch.com/")
ref3 = Reference(ref_type="user", link="test", consent=True)

skill1.references.append(ref1)
skill1.references.append(ref2)
skill1.references.append(ref3)

db_session.add(ref1)
db_session.add(ref2)
db_session.add(ref3)

skill2 = Skill(
    staff=staff1,
    name="Top lane matchups",
    description="Good at top lane matchups, tanks",
)
ref1 = Reference(ref_type="link", link="https://www.google.com/")
ref3 = Reference(ref_type="user", link="test", consent=False)

skill2.references.append(ref1)
skill2.references.append(ref3)

db_session.add(ref1)
db_session.add(ref3)

skill3 = Skill(
    staff=staff2,
    name="Pick Ban",
    description="Good att analyzing och doing pick ban",
)

ref1 = Reference(ref_type="link", link="https://www.google.com/")

skill3.references.append(ref1)

db_session.add(ref1)

db_session.add(skill1)
db_session.add(skill2)
db_session.add(skill3)

experience1 = Experience(
    type="Coach",
    description="Head coach, focus in team morale",
    at="Pepega Gaming",
    start=datetime(2020, 1, 1),
    end=datetime(2021, 1, 1),
    staff=staff2,
)

ref1 = Reference(ref_type="link", link="https://www.google.com/")
ref2 = Reference(ref_type="link", link="https://www.twitch.com/")
ref3 = Reference(ref_type="user", link="test")
experience1.references.append(ref1)
experience1.references.append(ref2)
experience1.references.append(ref3)

db_session.add(ref1)
db_session.add(ref2)
db_session.add(ref3)

experience2 = Experience(
    type="Analyst",
    description="Analyst, focus on LPL",
    at="Pepega Gaming",
    start=datetime(2020, 1, 1),
    end=datetime(2021, 1, 1),
    staff=staff3,
)


ref1 = Reference(ref_type="link", link="https://www.google.com/")
ref2 = Reference(ref_type="user", link="test")
experience2.references.append(ref1)
experience2.references.append(ref2)

db_session.add(ref1)
db_session.add(ref2)

experience3 = Experience(
    type="Assistant coach",
    description="Assistant coach, focus one to one relationships",
    at="Pepega Gaming",
    start=datetime(2021, 1, 1),
    staff=staff1,
)


ref1 = Reference(ref_type="link", link="https://www.google.com/")
experience3.references.append(ref1)

db_session.add(ref1)

db_session.add(experience1)
db_session.add(experience2)
db_session.add(experience3)

db_session.commit()
