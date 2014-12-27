require_relative 'helpers/spec_helper'

describe Sprtid::HomeApp do
	def app
		described_class
	end

	it 'should GET /' do
		get '/'
	end
end

