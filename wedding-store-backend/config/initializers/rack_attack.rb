class Rack::Attack
  ### Configure Cache ###
  Rack::Attack.cache.store = ActiveSupport::Cache::MemoryStore.new 

  ### Throttle Requests ###
  # Throttle all requests by IP (5 requests/second)
  throttle('req/ip', limit: 300, period: 5.minutes) do |req|
    req.ip
  end

  # Throttle POST requests to /auth (5 attempts/minute)
  throttle('logins/ip', limit: 5, period: 1.minute) do |req|
    if req.path == '/auth/login' && req.post?
      req.ip
    end
  end

  # Throttle booking attempts (3 attempts/minute)
  throttle('bookings/ip', limit: 3, period: 1.minute) do |req|
    if req.path.match?(/\/products\/\d+\/book/) && req.post?
      req.ip
    end
  end

  ### Custom Response ###
  self.throttled_responder = lambda do |env|
    [ 429,  # status
      { 'Content-Type' => 'application/json' },   # headers
      [{ error: { code: 'rate_limit_exceeded', message: "Too many requests. Please try again later." } }.to_json] # body
    ]
  end
end
