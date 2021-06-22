# coding: utf-8
require 'sinatra'
require 'sinatra/reloader'
require 'json'
require 'sequel'
require 'mysql2'
require 'securerandom'

configure do
  set :bind, '0.0.0.0'
  register Sinatra::Reloader
  also_reload "./*.rb"
end

DB = Sequel.mysql2(
  host: ENV['DB_HOST'],
  user: ENV['DB_USER'],
  password: ENV['DB_PASS'],
  database: ENV['DB_NAME'],
  encoding: 'utf8'
)

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
    token = SecureRandom.hex(45)
    DB[:users].insert({
                        name: name,
                        email: email,
                        token: token,
                        is_admin: is_admin
                      })
    user = DB[:user].find(token: token)
    rst[:data] = user

    # 後で権限確認処理とか入れたい。
    prm_group_id = params[:group_id]
    group = DB[:groups].find(group_id: prm_group_id)
    group_id = group ? group.id : 0
    DB[:user_groups].insert({
                              user_id: user.id,
                              group_id: group_id,
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

get '/api/group/:group_id/users/' do |group_id|
  begin
    users = DB[:groups]
              .joins(:users)
              .joins(:user_groups)
              .where(group_id: group_id)
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

get '/api/group/:group_id' do |group_id|
end

post '/api/group' do
end

put '/api/group' do
end

delete '/api/group' do
end
