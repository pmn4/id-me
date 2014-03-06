require_relative 'base_app'
require_relative 'models/ajax_response'
require_relative 'models/checkin'

module Sprtid
	class SprtidApp < BaseApp
		get '/' do
			content_type :'text/html'
			erb :app
		end

		get '/id/:id' do
			begin
				identity = Models::FullIdentity.find(params[:id])
				response = Models::AjaxResponse.new({
					:success => true,
					:content => identity.as_document
				})
			rescue Mongoid::Errors::DocumentNotFound => e
				LOGGER.error(e)
				response = Models::AjaxResponse.new({
					:success => false,
					:errors => ['Unable to find this Identity']
				})
			end

			content_type :'application/json'
			response.to_json
		end

		get '/id/:id/checkin' do
			begin
				identity = Models::FullIdentity.find(params[:id])
				response = Models::AjaxResponse.new({
					:success => true,
					:content => identity.as_document.merge({
						'checkinData' => {
							'mostRecent' => identity.checkins.last.as_document,
							'mostRecentForEvent' => identity.checkins.first.as_document
						}
					})
				})

				begin
					checkin = Models::Checkin.new({
						:method => params[:method].present? ? params[:method].to_sym : :scan,
						:device => params[:web].present? ? params[:device].to_sym : :web
					})
					# identity.checkins ||= []
					identity.checkins << checkin
					identity.save
				rescue => e # Mongoid::Errors::
					LOGGER.error(e)
				end
			rescue Mongoid::Errors::DocumentNotFound => e
				LOGGER.error(e)
				response = Models::AjaxResponse.new({
					:success => false,
					:errors => ['Unable to find this Identity']
				})
			end

			content_type :'application/json'
			response.to_json
		end

		get '/:organization/logo' do
			send_file("/images/#{params[:organization_name]}.png", :disposition => 'inline', :filename => "#{params[:organization_name]}.png")
		end
	end
end
