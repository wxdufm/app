# MongoDB Setup
Pull from homepage branch the docker update and docker-compose.yml should then be updated with the mongo info.
Follow these commands:
cd sqldocker
docker compose down -v
docker compose up -d
docker cp <wherever your mongo backup folder is>
docker exec -it mongo_shared mongorestore /mongo-backup
docker exec -it mongo_shared mongosh

Once you are inside:
use wxdu
show collections
db.downloads.findOne()

To access the album covers:
-find if downloads_db_id exists for a song in the releases folder
db.releases.findOne({ downloads_db_id: { $exists: true } })
-then take that id and use as the primary key for its associated document in the downloads folder
db.downloads.findOne({ _id: ObjectId('<downloads_db_id>') })
-extract DIRNAME from the "dirname" field and NONAUDIO in the "nonaudio field". Paste it into this URL:
https://beachyhead.wxdu.duke.edu/media/DIRNAME/NONAUDIO
note that the field value for "nonaudio" is a list, so you would want to connect the first one