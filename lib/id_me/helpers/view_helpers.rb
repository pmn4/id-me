module SprtId
	module Helpers
		module ViewHelpers
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
				'<em>sprt<strong>id</strong></em>'
			end
		end
	end
end
