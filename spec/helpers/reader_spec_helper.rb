ENV['RACK_ENV'] = 'test'

require 'rack/test'

module ReaderMixin
	include Rack::Test::Methods
	Dir[File.dirname(__FILE__) + '/../../lib/**/*.rb'].each do |file|
		require file
	end

	def app
		SprtId::ReaderApp
	end
end

RSpec.configure do |config|
	config.include MensMixin
	config.mock_with :rspec
	config.order = 'random'
end

