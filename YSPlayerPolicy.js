/*
 * VOD-Live JavaScript Library
 * Copyright (c) 2015-2018 Yospace Technologies Ltd. All Rights Reserved.
 */

//---------------------------------------------------------------------------------------------------------------------------------

/**
 * The Player classes are responsible for interfacing with the video player
 * 
 * @class YSPlayerPolicy
 * @constructor
 * @param {YSSession} _session The session instance managing this policy
 */

//---------------------------------------------------------------------------------------------------------------------------------

var YSPlayerPolicy = ClassHelper.makeClass({
    initialize: function(_session) {
        /**
         * A reference to the session which is responsible for encapsulating this
         * player policy instance.
         * 
         * @property session
         * @type YSSession
         * @protected
         */
        this.session = _session;
    },

    /**
     * <p>Helper method used for shutting down the instance cleanly.</p>
     * 
     * @method Destroy
     * @protected
     */
    Destroy: function() {
        this.session = null;
    },

    /**
     * Determine whether the player is permitted to seek to a permitted point in the stream.
     * Based on the provided location, the nearest permissible location is returned which should
     * be used by the player to override the viewers chosen seek location. This is to enable the 
     * ability to prevent skipping over adverts.
     * 
     * @method canSeekTo
     * @param {Number} offset Desired seek position (stream position in seconds)
     * @return {Number} "Best" stream position in seconds where seek is permitted
     */
    canSeekTo: function(offset) {
        Debugger.print("Checking seek to: " + offset);

        if (!(this.session instanceof YSLiveSession)) {
            Debugger.print("VOD can seek to: " + offset);

            // If in active break, return same position (no scrub)
            // Otherwise, find first active break prior to playhead...
            // ... and seek to start of that break, or allow the scrub if 
            // ... there is no prior active break
            var t = this.session.timeline;
            if (t) {
                if (!this.canSeek()) {
                    Debugger.print("Returning last position as we're in an active advert");
                    return this.session.lastPosition || 0;
                }

                var ta = t.getAllElements();
                var currEle = t.getElementAtTime(this.session.lastPosition);

                if (!ta || ta.length == 0) {
                    Debugger.print("No elements");
                } else {
                    var seek = -1;
                    var cleardown = false;
                    for (var i = ta.length - 1; i >= 0; i--) {
                        Debugger.print("Checking element from " + ta[i].offset + " with duration: " + ta[i].duration);
                        if (ta[i].getType() === YSTimelineElement.ADVERT) {
                            if (cleardown) {
                                var ads = ta[i].getAdverts().adverts;
                                for (var j = 0; j < ads.length; j++) {
                                    ads[j].setActive(false);
                                }
                            } else if (offset >= ta[i].offset) {
                                if (ta[i].getAdverts().isActive()) {
                                    Debugger.print("Break reports active");
                                    seek = ta[i].offset;
                                    cleardown = true;
                                }
                            }
                        }
                    }

                    if (cleardown) {
                        if ((this.session.player !== null) && (typeof this.session.player.UpdateTimeline === 'function')) {
                            Debugger.print("Reporting timeline to player: " + YSParseUtils.timecodeToString(t.getTotalDuration()));
                            this.session.player.UpdateTimeline(t);
                        }
                    }
                    return ((seek == -1) ? offset : seek);
                }
            } else {
                Debugger.print("No timeline");
            }

            return offset;
        }

        Debugger.print("Returning live default");
        // Default for LIVE as seeking not usually permitted
        return this.session.lastPosition;
    },

    /**
     * Determine whether the player is allowed to start video playback
     * 
     * @method canStart
     * @return {Boolean} <code>true</code> if playback may be started, otherwise <code>false</code>
     */
    canStart: function() {
        return true;
    },

    /**
     * Determine whether the player is allowed to stop video playback
     * 
     * @method canStop
     * @return {Boolean} <code>true</code> if playback may be stopped, otherwise <code>false</code>
     */
    canStop: function() {
        return true;
    },

    /**
     * Determine whether the player is allowed to pause video playback
     * 
     * @method canPause
     * @return {Boolean} <code>true</code> if playback may be paused, otherwise <code>false</code>
     */
    canPause: function() {
        if (this.session instanceof YSLiveSession) {
            return false;
        }

        return true;
    },

    /**
     * Determine whether the player is allowed to seek from the current playhead position
     * 
     * @method canSeek
     * @return {Boolean} <code>true</code> if seek is permitted, otherwise <code>false</code>
     */
    canSeek: function() {
        if (this.session instanceof YSLiveSession) {
            return false;
        }

        if (this.session.isInAnAdvert() && this.session.currentAdvert.isActive) {
            return false;
        }

        return true;
    },

    /**
     * Determine whether the player is allowed to skip the current advert
     * 
     * @method canSkip
     * @return {Number} <code>0+</code> if skip is permitted (the value is the delay in seconds 
     * before skip is permitted, otherwise <code>-1</code> which means the advert is not skippable
     */
    canSkip: function() {
        if (this.session.isInAnAdvert()) {
            if (this.session instanceof YSLiveSession) {
                return -1;
            } else {
                var ad = this.session.currentAdvert.advert;
                if (ad !== null) {
                    var linear = ad.getLinear();
                    if (linear !== null) {
                        var skip = linear.getSkipOffset();

                        if (this.session.currentAdvert.isActive === false) {
                            skip = 0;
                        }

                        if (skip === -1) {
                            return -1;
                        }

                        var elapsed = this.session.currentAdvert.timeElapsed();
                        var delay = (elapsed >= skip) ? 0 : (skip - elapsed);

                        if (this.session instanceof YSVoDSession) {
                            return delay;
                        } else {
                            var duration = linear.getDuration();
                            var remain = duration - elapsed;
                            var tl = this.session.timeline;
                            var live = tl.getTotalDuration() + tl.startOffset;
                            if ((this.session.lastPosition + remain) >= (live - YSPlayerPolicy.LIVE_TOLERANCE)) {
                                return -1;
                            }

                            return delay;
                        }
                    }
                }
            }

        }

        return -1;
    },

    /**
     * Determine whether the player is allowed to mute the audio playback
     * 
     * @method canMute
     * @return {Boolean} <code>true</code> if audio playback may be muted, otherwise <code>false</code>
     */
    canMute: function() {
        return true;
    },

    /**
     * Determine whether the player is allowed to change full screen to the specified full screen
     * state.
     * 
     * @method canChangeFullScreen
     * @param {Boolean} newState New fullscreen state requested (<code>true</code> to enter fullscreen,
     * <code>false</code> to leave fullscreen)
     * @return {Boolean} <code>true</code> if the player is allowed to make the fullscreen state transition
     * requested
     */
    canChangeFullScreen: function(newState) {
        return true;
    },

    /**
     * Determine whether the currently displayed non-linear creative may be expanded
     * 
     * @method canExpandCreative
     * @return {Boolean} <code>true</code> if the non-linear may be expanded, otherwise <code>false</code>
     */
    canExpandCreative: function() {
        return false;
    },

    /**
     * Determine whether the viewer is allowed to click-through on the currently displayed creative
     * 
     * @method canClickThrough
     * @return {Boolean} <code>true</code> if a clickthrough is permitted on the current creative, 
     * otherwise <code>false</code>
     */
    canClickThrough: function() {
        return true;
    }
});

YSPlayerPolicy.LIVE_TOLERANCE = 30;