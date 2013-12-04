require 'helpers/reader_spec_helper'

describe ReaderApp do
	it 'should GET /' do
		get '/'
		last_response.should be_ok
	end
end

