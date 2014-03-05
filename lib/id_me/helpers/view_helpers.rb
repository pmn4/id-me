module Sprtid
	module Helpers
		module ViewHelpers

			SPRTID_ORGANIZATION_NAME = 'sprtid'
			def organization_name
				WhiteLabel.organization || SPRTID_ORGANIZATION_NAME
			end

			def file_load(file)
				begin
					s = File.read(file)
				rescue Errno::ENOENT => e
					# LOGGER.warn e
					s = nil
				end
				s
			end

			def mobile?
				request.env['X_MOBILE_DEVICE']
			end

			def plaintext_logo
				'<em>sprt&middot;id</em>'
			end

			def complete?(*keys)
				ptr = params
				keys.each {|key| ptr = ptr[key] unless ptr.nil?}
				ptr.present? && (!ptr.respond_to?(:valid?) || ptr.valid?)
			end

			def first_name(full_name)
				full_name.gsub(/^([^ ]*).*/, '\1')
			end
		end
	end
end
