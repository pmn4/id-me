module SprtId
	class CookiedEntity
		def initialize(app, cookie_name, url_param, lifespan = nil)
			@app = app
			@cookie_name = cookie_name
			@url_param = url_param
			@lifespan = lifespan # nil suggests a session cookie will be used
		end

		def call(env)
			begin
				request = Rack::Request.new(env)

				pre_execution_entity = get_current_entity(request, @ccokie_name)
				requested_entity = get_requested_entity(request, @url_param)
				CookiedEntity.entity = requested_entity || pre_execution_entity

				status, headers, body = @app.call(env)

				post_execution_entity = CookiedEntity.entity

				if post_execution_entity != pre_execution_entity
					if(post_execution_entity.present?)
						set_entity!(headers, @cookie_name, post_execution_entity, @lifespan)
					else
						unset_entity!(headers, @cookie_name)
					end
				end

				[status, headers, body]
			ensure
				CookiedEntity.entity = nil
			end
		end

		class << self
			def entity
				Thread.current[self.cache_key]
			end

			def entity!(entity)
				self.entity = entity
			end
		end

		private

		class << self
			def cache_key
				@cache_key ||= "__#{self.name}__".to_sym
				@cache_key
			end

			def entity=(entity)
				Thread.current[self.cache_key] = entity
			end
		end

		def get_current_entity(request, cookie_name)
            cookie = request.cookies.find{|c| c[0] == cookie_name}

            return nil if cookie.blank?

            cookie[1]
		end

		def get_requested_entity(request, url_param)
			request.params[url_param]
		end

		def set_entity!(headers, cookie_name, entity, expiry)
			Rack::Utils.set_cookie_header!(headers, cookie_name, {
				:value => entity,
				:path => '/',
				:expires => expiry,
				:httponly => true
			})
		end

		def unset_entity!(headers, cookie_name)
			Rack::Utils.delete_cookie_header!(headers, cookie_name, {
				:path => '/'
			})
		end
	end
end
