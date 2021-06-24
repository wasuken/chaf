# coding: utf-8
require 'sinatra'
require 'sinatra/reloader'
require 'json'
require 'sequel'
require 'mysql2'
require 'securerandom'
require 'digest'

configure do
  set :bind, '0.0.0.0'
  register Sinatra::Reloader
  also_reload "./*.rb"
  enable :sessions
  set :session_secret, "session_encryption"
end

# これ途中で変えたら認証一切できななるで
SALT = ENV['SALT'] | ''

DB = Sequel.mysql2(
  host: ENV['DB_HOST'],
  user: ENV['DB_USER'],
  password: ENV['DB_PASS'],
  database: ENV['DB_NAME'],
  encoding: 'utf8'
)

# Views
get '/' do
  redirect '/user/login' unless session[:user_id]
  erb :index
end

get '/user/register' do
  redirect '/' if session[:user_id]
  erb :register
end

post '/user/register' do
  begin
    name = params[:name]
    enail = params[:email]
    is_admin = params[:is_admin] ? true : false
    password = params[:password]

    password_hash = Digest::SHA2.hexdigest(password + SALT)
    token = SecureRandom.hex(45)

    DB[:users].insert(
      {
        name: name,
        email: email,
        token: token,
        is_admin: is_admin,
        password_hash: password_hash,
      }
    )
    redirect '/user/login'
  rescue => e
    p e
    redirect '/user/register'
  end
end

get '/user/login' do
  erb :login
end

# Auth
post '/user/login' do
  begin
    raise "Empty user_id." if params[:user_id].nil? || params[:user_id].empty?
    raise "Empty password." if params[:password].nil? || params[:password].empty?

    user_id = params[:user_id]
    password_hash = Digest::SHA2.hexdigest(params[:password] + SALT)

    user = DB[:users].find(user_id: user_id)
    raise "Not exists user." if user.nil?

    unless user[:password_hash] === password_hash
      raise "Invalid User Password[#{user_id} : #{password_hash}]."
    end

    session[:user_id] = user[:id]
    redirect '/'
  rescue => e
    p e
    session.clear
    redirect '/user/login'
  end
end

## API

# User
get '/api/users' do
  rst = {
    status: 200,
    msg: ''
  }
  begin
    rst[:data] = DB[:users]
  rescue => e
    p e
    rst[:status] = 900
    rst[:msg] = 'Error'
  ensure
    return rst
  end
end

get '/api/user/:user_id' do |user_id|
  rst = {
    status: 200,
    msg: ''
  }
  begin
    user = DB[:users].find(user_id: user_id)
    rst[:data] = user
  rescue => e
    p e
    rst[:status] = 900
    rst[:msg] = 'Error'
  ensure
    return rst
  end
end

post '/api/user' do
  begin
    name = params[:name]
    enail = params[:email]
    is_admin = params[:is_admin] ? true : false
    password = params[:password]

    password_hash = Digest::SHA2.hexdigest(password + SALT)
    token = SecureRandom.hex(45)

    DB[:users].insert(
      {
        name: name,
        email: email,
        token: token,
        is_admin: is_admin,
        password_hash: password_hash,
      }
    )
    user = DB[:user].find(token: token)
    rst[:data] = user

    # 後で権限確認処理とか入れたい。
    prm_grp_id = params[:grp_id]
    grp = DB[grps].find(grp_id: prm_grp_id)
    grp_id = grp ? grp.id : 0
    DB[:user_grps].insert({
                              user_id: user.id,
                              grp_id: grp_id,
                            })
  rescue => e
    p e
    rst[:status] = 900
    rst[:msg] = 'Error'
  ensure
    return rst
  end
end

put '/api/user' do
end

delete '/api/user' do
end

# Group
get '/api/groups' do
end

get '/api/group/:grp_id/users/' do |grp_id|
  begin
    users = DB[grps]
              .joins(:users)
              .joins(:user_grps)
              .where(grp_id: grp_id)
    rst[:data] = users.map{|u|
      {
        name: u[:users][:name],
        is_admin: u[:is_admin]? 'admin' : 'user'
      }
    }
  rescue => e
    p e
    rst[:status] = 900
    rst[:msg] = 'Error'
  ensure
    return rst
  end
end

get '/api/group/:grp_id' do |grp_id|
end

post '/api/group' do
end

put '/api/group' do
end

delete '/api/group' do
end
