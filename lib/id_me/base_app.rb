# require 'sinatra'
require 'sinatra/base'
require 'sinatra/contrib'
require 'compass'
require 'rack/mobile-detect'
require 'logger'

require_relative 'middleware/white_label'
require_relative 'middleware/event'
require_relative 'helpers/view_helpers'

module Sprtid
	class BaseApp < Sinatra::Base
		register Sinatra::Contrib

		use WhiteLabel
		use Event

		set :root, File.expand_path("../..", File.dirname(__FILE__))
		set :views, File.dirname(__FILE__) + '/views'
		set :public_folder, 'public'

		helpers Helpers::ViewHelpers

		LOGGER = Logger.new(STDOUT) unless defined?(LOGGER)

		configure :development do
			register Sinatra::Reloader
		end

		configure do
			Compass.add_project_configuration(File.join(settings.root, 'config', 'compass.config'))
			enable :logging
			LOGGER.level = Logger::DEBUG
		end

		get '/styles/:name.css' do
			content_type 'text/css', :charset => 'utf-8'
			scss(:"stylesheets/#{params[:name]}", Compass.sass_engine_options)
		end

		error 400..510 do
			puts inspect
			request.env['sinatra_error']
		end
	end
end
