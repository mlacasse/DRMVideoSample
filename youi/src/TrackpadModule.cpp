#include "TrackpadModule.h"

#include "youireact/ShadowTree.h"
#include "youireact/nodes/ReactComponent.h"

#include <event/YiEvent.h>
#include <event/YiTrackpadEvent.h>
#include <framework/YiApp.h>
#include <framework/YiAppContext.h>
#include <scenetree/YiSceneManager.h>

using namespace yi::react;

#define TAG "TrackpadModule"

YI_RN_INSTANTIATE_MODULE(TrackpadModule, EventEmitterModule);

static const std::string YI_TRACKPAD_MOVE_EVENT = "YI_TRACKPAD_MOVE";

TrackpadModule::TrackpadModule()
{
    SetSupportedEvents({
        YI_TRACKPAD_MOVE_EVENT
    });
}

TrackpadModule::~TrackpadModule()
{
    StopObserving();
}

void TrackpadModule::StartObserving()
{
    auto pSceneManager = CYIAppContext::GetInstance()->GetApp()->GetSceneManager();
    pSceneManager->AddGlobalEventListener(YI_TRACKPAD_MOVE, this);
}

void TrackpadModule::StopObserving()
{
    auto pSceneManager = CYIAppContext::GetInstance()->GetApp()->GetSceneManager();
    pSceneManager->RemoveGlobalEventListener(YI_TRACKPAD_MOVE, this);
}

bool TrackpadModule::HandleEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent)
{
    YI_UNUSED(pDispatcher);
    
    if (!pEvent->IsTrackpadEvent() || (pEvent->m_pTarget != pEvent->m_pCurrentTarget) || pEvent->GetType() != YI_TRACKPAD_MOVE)
    {
        return false;
    }
    
    auto trackPadEvent = static_cast<const CYITrackpadEvent &>(*pEvent);
   
    folly::dynamic result = folly::dynamic::object;
    
    result["eventType"] = "move";
    result["eventName"] = YI_TRACKPAD_MOVE_EVENT;
    result["translation"] = folly::dynamic::object("x",ToDynamic(trackPadEvent.m_Translation.x))("y",ToDynamic(trackPadEvent.m_Translation.y));
    
    EmitEvent(YI_TRACKPAD_MOVE_EVENT, result);
    
    return false;
}
