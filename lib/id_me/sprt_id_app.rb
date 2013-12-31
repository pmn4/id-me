require_relative 'base_app'

module SprtId
	class SprtIdApp < BaseApp
		get '/' do
			content_type :'text/html'

			erb :app
		end
	end
end
