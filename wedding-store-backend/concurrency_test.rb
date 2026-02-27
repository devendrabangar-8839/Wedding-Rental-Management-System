require 'net/http'
require 'json'
require 'parallel'

# Note: This script assumes a user is logged in and has a token.
# For simplicity, we'll just check if multiple simultaneous requests hit the lock correctly.

URL = URI('http://localhost:3001/products/1/book') # Adjust ID as needed
TOKEN = 'YOUR_JWT_TOKEN' # This would be fetched in a real test

def attempt_booking
  http = Net::HTTP.new(URL.host, URL.port)
  request = Net::HTTP::Post.new(URL)
  request['Authorization'] = "Bearer #{TOKEN}"
  request['Content-Type'] = 'application/json'
  request.body = {
    start_date: '2026-06-01',
    end_date: '2026-06-03',
    size: 'M',
    address: '123 Production Lane'
  }.to_json

  http.request(request)
end

puts "Simulating 10 concurrent booking requests..."
results = Parallel.map(1..10, in_threads: 10) do
  attempt_booking
end

status_codes = results.map(&:code).tally
puts "Results: #{status_codes}"
