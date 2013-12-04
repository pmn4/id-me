module IdMe
	module Helpers
		module ViewHelpers
			def file_load(file)
				begin
					s = File.read(file)
				rescue Errno::ENOENT => e
					# LOGGER.warn e
p e
					s = nil
				end
				s
			end
		end
	end
end
