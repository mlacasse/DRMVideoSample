# AT&T Video Player sample w/ DRM

This sample demonstrates how to play content using either Widevine or Fairplay DRM.

The Widevine implementation demonstrates the WidevineCustomRequestDrmHandler.

## Requirements

Run `youi-tv docs` from a command prompt for detailed documentation

## Building - with remote or development bundling

You first need to install the JS dependencies and run the bundling server:

	yarn install
	yarn start

Now, run the following to build and run a YiRN application (in this case on OSX):

	cd youi/
	./generate.rb -p osx
	./build.rb -b build/osx

At this point you can run the application from commandline from (`youi/build/osx`) or open in your IDE.



## Building - with remote or development bundling

You first need to install the JS dependencies:

	yarn install

Now, run the following to build and run a YiRN application (in this case on OSX):

	cd youi/
	./generate.rb -p osx --local --file index.youi.js
	./build.rb -b build/osx

At this point you can run the application from commandline from (`youi/build/osx`) or open in your IDE. The application assets will include a bundled copy of the JS application.

