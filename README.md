# stepBlogBackend

Backend is deployed to [Heroku](https://www.heroku.com/). \
Frontend is hosted by [Firebase](https://firebase.google.com/). 

Website url: https://footprint-frontend.web.app/posts \
Backend:https://github.com/kjw472800/stepBlogBackend \
Frontend:https://github.com/kjw472800/stepBlogfrontend

## Development
```bash
1. npm install
# config environment variables 
2. ceate .env
3. add variable
Example:
DB_HOST= MongoDB url
SALT_ROUND=SALT_ROUND
jwtKey=YOUR_JWT_KEY
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
AWS_BUCKET=YOUR_AWS_S3_BUCKET_NAME
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_ACCESS_SECRET_KEY=YOUR_AWS_ACCESS_SECRET_KEY
AWS_REGION=YOUR_AWS_REGION
AWS_FILE_URL=YOUR_AWS_FILE_URL
# run dev server 
3. npm start
4. can change package.json start scripts to use nodemon
```
