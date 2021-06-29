# coding: utf-8
require 'sinatra'
require 'sinatra/reloader'
require 'json'
require 'sequel'
require 'mysql2'
require 'securerandom'
require 'digest'
require 'date'

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

ATTENDANCE_TYPES = [
  '退勤',
  '出勤',
  '休憩',
]

# Helpers
private def datetime_valid?(str)
  !! DateTime.parse(str) rescue false
end

private def user_latest_attendance(user_id)
  DB[:user_attendances]
    .where(user_id: user_id)
    .order(Sequel.desc(:value))
    .first
end

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
    token = params[:token]
    if token
      user = DB[:users]
               .where(token: token)
               .first
      latest = user_latest_attendance(user[:user_id])
      status = 1
      if latest
        status = latest[:attendance_type]
      end
      rst[:data] = {
        name: user[:name],
        token: user[:token],
        status: status,
      }
    else
      email = params[:email]
      password = params[:password]
      user = DB[:users]
               .where(email: email)
               .first
      if !(params[:email] && params[:password] && user)
        raise 'Invalid Auth.'
      end
      salt = ''
      password_hash = Digest::SHA2.hexdigest(password + salt)
      if user[:password_hash] === password_hash
        latest = user_latest_attendance(user[:user_id])
        status = 1
        if latest
          status = latest[:attendance_type]
        end
        rst[:data] = {
          name: user[:name],
          token: user[:token],
          status: status,
        }
      else
        rst[:status] = 901
        rst[:msg] = 'Auth Error'
      end
    end
  rescue => e
    puts e.message
    rst[:status] = 900
    rst[:msg] = e.message
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
    DB[:user_grps].insert(
      {
        user_id: user[:user_id],
        grp_id: grp_id,
      }
    )
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
              .join_table(:users)
              .join_table(:user_grps)
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

get '/api/user/attendances' do
  content_type :json
  rst = {
    status: 200,
    msg: ''
  }
  begin
    token = params[:token]
    raise 'Not Exists token.' unless token
    t = DateTime.now
    atn_begin = params[:begin]
    atn_begin ||= t.strftime('%Y/%m/%d 00:00:00')
    atn_end = params[:end]
    atn_end ||= t.strftime('%Y/%m/%d 23:59:59')
    data = DB[:user_attendances]
             .join_table(:inner, :users)
             .where(token: token)
             .select(:attendance_type, :name, :value)
             .to_a
    rst[:data] = data
  rescue => e
    puts e.message
    rst[:status] = 900
    rst[:msg] = e.full_message
  ensure
    return rst.to_json
  end
end

post '/api/user/attendance' do
  content_type :json
  rst = {
    status: 200,
    msg: ''
  }
  begin
    token = params[:token]
    raise 'Not Exists token.' unless token
    user = DB[:users].where(token: token).first
    raise 'Not Exists user who have token.' unless user
    t = DateTime.now
    value = params[:value]
    value ||= t.strftime('%Y/%m/%d %H:%M:%S')
    type = params[:type]
    raise 'Not Exists type.' unless type
    type = type.to_i
    raise 'Invalid type.' if type < 0 || type > 2

    latest = user_latest_attendance(user[:user_id])
    if latest && latest[:attendance_type] === type
      raise "Invalid status(#{latest[:attendance_type]} => #{type})"
    end
    # 退勤後に休憩と同じStatusへの変更はNG
    if latest &&
       (
         latest[:attendance_type] === type ||
         (
           latest[:attendance_type] === ATTENDANCE_TYPES[1] &&
           type === ATTENDANCE_TYPES[2]
         )
       )
      raise "Invalid status(#{latest[:attendance_type]} => #{type})"
    end

    rec = {
      user_id: user[:user_id],
      attendance_type: type,
      value: value,
    }
    DB[:user_attendances].insert(rec)
  rescue => e
    puts e.message
    rst[:status] = 900
    rst[:msg] = e.message
  ensure
    return rst.to_json
  end
end

get '/*' do
  redirect '/'
end
