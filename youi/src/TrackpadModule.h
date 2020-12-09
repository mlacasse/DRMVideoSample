#ifndef _YOUIREACT_TRACKPAD_MODULE_H_
#define _YOUIREACT_TRACKPAD_MODULE_H_

#include <event/YiEventHandler.h>
#include <event/YiEventFilter.h>
#include <youireact/modules/EventEmitter.h>

class CYIEvent;
class CYITrackpadEvent;

namespace yi
{
namespace react
{
class ReactComponent;

class YI_RN_MODULE(TrackpadModule, EventEmitterModule), public CYIEventHandler, public CYIEventFilter
{
public:
    enum class Direction
    {
        Up,
        Down,
        Left,
        Right,
        Center,
    };

    TrackpadModule();
    virtual ~TrackpadModule();

    static CYISignal<std::shared_ptr<CYITrackpadEvent>> EmitTrackpadEvent;
    static CYISignal<TrackpadModule::Direction> EmitTrackpadDpadEvent;

    const std::string getDirectionString(TrackpadModule::Direction direction) const
    {
        switch(direction)
        {
            case TrackpadModule::Direction::Up:
                return "up";
            case TrackpadModule::Direction::Down:
                return "down";
            case TrackpadModule::Direction::Left:
                return "left";
            case TrackpadModule::Direction::Right:
                return "right";
            case TrackpadModule::Direction::Center:
                return "center";
        }
        
        return "None";
    };

    YI_RN_EXPORT_NAME(TrackpadModule);

private:
    virtual bool HandleEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent) override;
    virtual void StartObserving() override;
    virtual void StopObserving() override;
    virtual bool PreFilterEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent, CYIEventHandler *pDestination) override;
    virtual bool PostFilterEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent, CYIEventHandler *pDestination) override;

    void OnEmitTrackpadEvent(std::shared_ptr<CYITrackpadEvent> pEvent);
    void OnEmitTrackpadDpadEvent(TrackpadModule::Direction direction);

    void SendEvent(CYIEvent *pEvent);
};

} // namespace react

} // namespace yi

#endif // _YOUIREACT_TRACKPAD_MODULE_H_
