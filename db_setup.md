# setup git with ssh
ssh-keygen -t ecdsa -b 256 -C "<email>"
cat .ssh/id_ecdsa.pub # add the o/p to github
cd /home/livedoctors24-app/
git clone --depth 1 git@github.com:blockvished/LiveDoctors.git
# we need to install node for building

# setup postgres
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl status postgresql
sudo -i -u postgres
psql postgres
CREATE USER livedoctor WITH PASSWORD '<password>';
CREATE DATABASE live_db OWNER livedoctor;
GRANT ALL PRIVILEGES ON DATABASE live_db TO livedoctor;

# will check later for postgres
# install nvm for node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
npm i # from LiveDoctors
npm run  build # should be done after entering .env 

# install pm2 and run the nextjs project
sudo npm install -g pm2
pm2 start npm --name "live_doctor" -- run start:prod
pm2 startup
pm2 save

# next step is nginx, and ssl is preconfigured as i was told
sudo nano /etc/nginx/sites-available/app.livedoctors24.com
sudo ln -s /etc/nginx/sites-available/app.livedoctors24.com /etc/nginx/sites-enabled/
sudo systemctl reload nginx

# since frontend is connected with domain and ssl, test db and fix
sudo service postgresql status
sudo nano /etc/postgresql/16/main/postgresql.conf # uncomment listen_addresses = 'localhost'
sudo nano /etc/postgresql/16/main/pg_hba.conf
psql -h localhost -U livedoctor -d live_db
nano .env # DATABASE_URL=postgresql://livedoctor:<password>@localhost:5432/live_db
npm run build
pm2 restart live_doctor
sudo ufw allow from 69.62.79.66 to any port 5432
npm run db:gen
npm run db:migrate

# to expose the db
sudo nano /etc/postgresql/16/main/postgresql.conf # listen_addresses = '*'
sudo ufw allow 5432/tcp or sudo ufw allow from 69.62.79.66 to any port 5432

add
hostssl all all 69.62.79.66/32 scram-sha-256
in
sudo nano /etc/postgresql/16/main/pg_hba.conf

and restart postgres with ip address change in .env
sudo systemctl restart postgresql

# misc

host    live_db         livedoctor        69.62.79.66/32        scram-sha-256
hostssl live_db         livedoctor        69.62.79.66/32        scram-sha-256
hostssl live_db         livedoctor        182.48.224.12/32      scram-sha-256

# very important
npx ts-node ./scripts/plansandfeature.ts