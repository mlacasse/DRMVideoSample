//
//  InteractionModule.h
//  DRMVideoSample
//
//  Created by Marc Lacasse on 2020-03-10.
//

#ifndef _INTERACTION_MODULE_H_
#define _INTERACTION_MODULE_H_

#include <event/YiEventHandler.h>
#include <youireact/modules/EventEmitter.h>

class CYIEvent;

namespace yi
{
namespace react
{
class ReactComponent;

class YI_RN_MODULE(InteractionModule, EventEmitterModule), public CYIEventHandler
{
public:
    InteractionModule();
    virtual ~InteractionModule();
    
    YI_RN_EXPORT_NAME(Interaction);
    
private:
    virtual bool HandleEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent) override;
    virtual void StartObserving() override;
    virtual void StopObserving() override;
};

} // namespace react

} // namespace yi

#endif /* _INTERACTION_MODULE_H_ */
