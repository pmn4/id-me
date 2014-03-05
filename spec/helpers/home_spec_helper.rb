ENV['RACK_ENV'] = 'test'

require 'rack/test'

module HomeMixin
	include Rack::Test::Methods
	Dir[File.dirname(__FILE__) + '/../../lib/**/*.rb'].each do |file|
		require file
	end

	def app
		Sprtid::HomeApp
	end
end

RSpec.configure do |config|
	config.include HomeMixin
	config.mock_with :rspec
	config.order = 'random'
end

