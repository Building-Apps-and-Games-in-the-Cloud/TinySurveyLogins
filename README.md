# Tiny Survey

Creates tiny surveys which are stored in a database. 

## Configuration

### Database
The database is set using the following environment variable:
```
DATABASE_URL=mongodb://localhost/tiny_surveys
```
### Initial Admin Username and password

The initial username and password for the admin user are set using the following environment variables:

```
INITIAL_ADMIN_USERNAME=surveyMaster@tinysurveys.com
INITIAL_ADMIN_PASSWORD=mango-chutney-diva
```
### Keys

You will need to create keys for the access token management. 

```
ACTIVE_TOKEN_SECRET=BAA95340FD3908F8571F87E30887B0E4870A4E8C4291A6498991B29661AB42B0DE23ABEC309869E19F1D1F43B61597DCEA1491ACB14C07F07827B1013DFC3E23
REFRESH_TOKEN_SECRET=416310A5824409FE02A5FBB8D59CB3E35E57BAA97E4B60A96EE18582DC509EFCD68C618D2FE53B8C517F438C192FA715B11D73C49C2993319C993AB5A7BA5688
```