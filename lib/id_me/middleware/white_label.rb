module Sprtid
	class WhiteLabel
		COOKIE_NAME = 'sprtid_wl'
		URL_PARAM = 'white-label'

		def initialize(app)
			@app = app
		end

		def call(env)
			begin
				request = Rack::Request.new(env)

				pre_execution_organization = get_current_organization(request)
				requested_organization = get_requested_organization(request)
				WhiteLabel.organization = requested_organization || pre_execution_organization

				status, headers, body = @app.call(env)

				post_execution_organization = WhiteLabel.organization

				if post_execution_organization != pre_execution_organization
					if(post_execution_organization.present?)
						set_organization!(headers, post_execution_organization)
					else
						unset_organization!(headers)
					end
				end

				[status, headers, body]
			ensure
				WhiteLabel.organization = nil
			end
		end

		class << self
			def organization
				Thread.current[:white_label_organization]
			end

			def organization!(organization)
				self.organization = organization
			end
		end

		private

		def self.organization=(organization)
			Thread.current[:white_label_organization] = organization
		end

		def get_current_organization(request)
            cookie = request.cookies.find{|c| c[0] == COOKIE_NAME}

            return nil if cookie.blank?

            cookie[1]
		end

		def get_requested_organization(request)
			request.params[URL_PARAM]
		end

		def set_organization!(headers, organization)
			Rack::Utils.set_cookie_header!(headers, COOKIE_NAME, {
				:value => organization,
				:path => '/',
				:expires => Time.new + 2.years.to_i,
				:httponly => true
			})
		end

		def unset_organization!(headers)
			Rack::Utils.delete_cookie_header!(headers, COOKIE_NAME, {
				:path => '/'
			})
		end
	end
end
