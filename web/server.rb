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
end

# これ途中で変えたら認証一切できななるで
DB = Sequel.mysql2(
  host: ENV['DB_HOST'],
  user: ENV['DB_USER'],
  password: ENV['DB_PASS'],
  database: ENV['DB_NAME'],
  encoding: 'utf8'
)

# Views
get '/' do
  File.read(File.join('public', 'index.html'))
end

## API

# User
get '/api/users' do
  content_type :json
  rst = {
    status: 200,
    msg: ''
  }
  begin
    rst[:data] = DB[:users]
  rescue => e
    puts e.message
    rst[:status] = 900
    rst[:msg] = 'Error'
  ensure
    return rst.to_json
  end
end

get '/api/user' do
  content_type :json
  rst = {
    status: 200,
    msg: ''
  }
  begin
    email = params[:email]
    password = params[:password]
    user = DB[:users].where(email: email).first
    if !(params[:email] && params[:password] && user)
      raise 'Invalid Auth.'
    end
    salt = ''
    password_hash = Digest::SHA2.hexdigest(password + salt)
    if user[:password_hash] === password_hash
      rst[:data] = {
        name: user[:name],
        token: user[:token],
      }
    else
      rst[:status] = 901
      rst[:msg] = 'Error'
    end
  rescue => e
    puts e.message
    rst[:status] = 900
    rst[:msg] = 'Error'
  ensure
    return rst.to_json
  end
end

post '/api/user' do
  content_type :json
  rst = {
    status: 200,
    msg: ''
  }
  begin
    name = params[:name]
    email = params[:email]
    is_admin = params[:is_admin] ? true : false
    raise 'Not exists param: password' unless params[:password]
    password = params[:password]
    salt = ''

    password_hash = Digest::SHA2.hexdigest(password + salt)
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
    user = DB[:user].where(token: token).first
    rst[:data] = user

    # 後で権限確認処理とか入れたい。
    prm_grp_id = params[:grp_id]
    grp = DB[grps].where(grp_id: prm_grp_id).first
    grp_id = grp ? grp.id : 0
    DB[:user_grps].insert({
                              user_id: user.id,
                              grp_id: grp_id,
                            })
  rescue => e
    puts e.backtrace
    rst[:status] = 900
    rst[:msg] = e.message
  ensure
    return rst.to_json
  end
end

put '/api/user' do
  content_type :json
  rst = {
    status: 200,
    msg: ''
  }
  begin

  rescue => e
    puts e.message
  ensure
    return rst.to_json
  end
end

delete '/api/user' do
  content_type :json
  rst = {
    status: 200,
    msg: ''
  }
  begin

  rescue => e
    puts e.message
  ensure
    return rst.to_json
  end
end

# Group
get '/api/groups' do
  content_type :json
  rst = {
    status: 200,
    msg: ''
  }
  begin

  rescue => e
    puts e.message
  ensure
    return rst.to_json
  end
end

get '/api/group/:grp_id/users/' do |grp_id|
  content_type :json
  rst = {
    status: 200,
    msg: ''
  }
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
    puts e.backtrace
    rst[:status] = 900
    rst[:msg] = e.message
  ensure
    return rst.to_json
  end
end

get '/api/group/:grp_id' do |grp_id|
  content_type :json
  rst = {
    status: 200,
    msg: ''
  }
  begin

  rescue => e
    puts e.message
    rst[:status] = 900
    rst[:msg] = e.message
  ensure
    return rst.to_json
  end
end

post '/api/group' do
  content_type :json
  rst = {
    status: 200,
    msg: ''
  }
  begin

  rescue => e
    puts e.message
    rst[:status] = 900
    rst[:msg] = e.message
  ensure
    return rst.to_json
  end
end

put '/api/group' do
  content_type :json
  rst = {
    status: 200,
    msg: ''
  }
  begin

  rescue => e
    puts e.message
    rst[:status] = 900
    rst[:msg] = e.message
  ensure
    return rst.to_json
  end
end

delete '/api/group' do
  content_type :json
  rst = {
    status: 200,
    msg: ''
  }
  begin

  rescue => e
    puts e.message
    rst[:status] = 900
    rst[:msg] = e.message
  ensure
    return rst.to_json
  end
end

get '/api/attendances' do
  content_type :json
  rst = {
    status: 200,
    msg: ''
  }
  begin
    token = params[:token]
    raise 'Not Exists token.' unless token
    data = DB[:user_attendances]
             .join_table(:users)
             .where(token: token)
    rst[:data] = data
  rescue => e
    puts e.message
    rst[:status] = 900
    rst[:msg] = e.message
  ensure
    return rst.to_json
  end
end
