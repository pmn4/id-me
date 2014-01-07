require_relative 'base_app'

module SprtId
	class SprtIdApp < BaseApp
		get '/' do

			content_type :'text/html'
			erb :app
		end

		get '/id/:id' do
			identity = Models::FullIdentity.find(params[:id])

			content_type :'application/json'
			identity.as_document.to_json
		end
	end
end
