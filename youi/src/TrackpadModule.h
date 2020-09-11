#ifndef _YOUIREACT_TRACKPAD_MODULE_H_
#define _YOUIREACT_TRACKPAD_MODULE_H_

#include <event/YiEventHandler.h>
#include <event/YiEventFilter.h>
#include <utility/YiTimer.h>
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
    TrackpadModule();
    virtual ~TrackpadModule();

    static CYISignal<std::shared_ptr<CYIEvent>> EmitTrackpadEvent;

    YI_RN_EXPORT_NAME(TrackpadModule);

private:
    virtual bool HandleEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent) override;
    virtual void StartObserving() override;
    virtual void StopObserving() override;
    virtual bool PreFilterEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent, CYIEventHandler *pDestination) override;
    virtual bool PostFilterEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent, CYIEventHandler *pDestination) override;

    void OnEmitTrackpadEvent(std::shared_ptr<CYIEvent> pEvent);
    void OnUpKeyTimeout(int32_t);

    void SendEvent(CYIEvent *pEvent);
    
    CYITimer m_upKeyTimer;
    
    bool m_downKeyPressed;
};

} // namespace react

} // namespace yi

#endif // _YOUIREACT_TRACKPAD_MODULE_H_
