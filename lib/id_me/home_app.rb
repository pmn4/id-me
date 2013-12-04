# require 'sinatra'
require 'sinatra/base'
require 'compass'

require_relative 'helpers/view_helpers'

module IdMe
	class HomeApp < Sinatra::Base
		set :root, File.expand_path("../..", File.dirname(__FILE__))
		set :views, File.dirname(__FILE__) + '/views'
		set :public_folder, 'public'

		helpers Helpers::ViewHelpers

		configure :development do
			register Sinatra::Reloader
		end

		configure do
			Compass.add_project_configuration(File.join(Sinatra::Application.root, 'config', 'compass.config'))
		end

		get '/styles/:name.css' do
			content_type 'text/css', :charset => 'utf-8'
			scss(:"stylesheets/#{params[:name]}", Compass.sass_engine_options)
		end

		get '/' do
			content_type :'text/html'
			erb :index
		end

		error 400..510 do
			puts inspect
			request.env['sinatra_error']
		end
	end
end
