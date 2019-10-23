#ifndef _YOUIREACT_TRACKPAD_MODULE_H_
#define _YOUIREACT_TRACKPAD_MODULE_H_

#include "youireact/modules/EventEmitter.h"
#include <event/YiEventHandler.h>

class CYIEvent;
class CYITrackpadEvent;

namespace yi
{
namespace react
{
class ReactComponent;

class YI_RN_MODULE(TrackpadModule, EventEmitterModule), public CYIEventHandler
{
public:
    TrackpadModule();
    virtual ~TrackpadModule();
    
    YI_RN_EXPORT_NAME(TrackpadModule);
    
private:
    virtual bool HandleEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent) override;
    virtual void StartObserving() override;
    virtual void StopObserving() override;
};

} // namespace react

} // namespace yi

#endif // _YOUIREACT_TRACKPAD_MODULE_H_
