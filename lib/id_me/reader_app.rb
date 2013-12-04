require 'sinatra'
require 'sinatra/base'
require 'sinatra/reloader' if development?  # in dev, reload your app every time you make a change.  no more restarting!
require 'json'

require_relative 'helpers/view_helpers'

module IdMe
	class ReaderApp < Sinatra::Base
		set :root, File.expand_path("../..", File.dirname(__FILE__))
		set :views, File.dirname(__FILE__) + '/views'

		configure :development do
			register Sinatra::Reloader
		end

		helpers Helpers::ViewHelpers

		before do
			content_type :json
		end

		get '/' do
			content_type :'text/html'
			erb :card
		end
	end
end

