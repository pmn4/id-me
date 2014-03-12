require_relative 'helpers/spec_helper'
require 'securerandom'

describe Sprtid::BaseApp do
	class TestApp < Sprtid::BaseApp
		get '/' do
		end
	end

	def app
		TestApp
	end

	it "should GET /" do
		get '/'
		last_response.should be_ok
	end
end

