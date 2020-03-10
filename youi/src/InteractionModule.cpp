#include "InteractionModule.h"

#include <event/YiEvent.h>
#include <event/YiTrackpadEvent.h>
#include <framework/YiApp.h>
#include <framework/YiAppContext.h>
#include <scenetree/YiSceneManager.h>

#include <youireact/ShadowTree.h>
#include <youireact/nodes/ReactComponent.h>

using namespace yi::react;

#define LOG_TAG "InteractionModule"

YI_RN_INSTANTIATE_MODULE(InteractionModule, EventEmitterModule);

static const std::string YI_INTERACTION_EVENT = "USER_INTERACTION";

InteractionModule::InteractionModule()
{
    SetSupportedEvents({
        YI_INTERACTION_EVENT
    });
}

InteractionModule::~InteractionModule()
{
    StopObserving();
}

void InteractionModule::StartObserving()
{
    auto pSceneManager = CYIAppContext::GetInstance()->GetApp()->GetSceneManager();

    pSceneManager->AddGlobalEventListener(CYIEvent::Type::TrackpadMove, this);
    pSceneManager->AddGlobalEventListener(CYIEvent::Type::TrackpadUp, this);
    pSceneManager->AddGlobalEventListener(CYIEvent::Type::TrackpadDown, this);
    pSceneManager->AddGlobalEventListener(CYIEvent::Type::KeyUp, this);
    pSceneManager->AddGlobalEventListener(CYIEvent::Type::KeyDown, this);
    pSceneManager->AddGlobalEventListener(CYIEvent::Type::KeyInput, this);
    pSceneManager->AddGlobalEventListener(CYIEvent::Type::ActionUp, this);
    pSceneManager->AddGlobalEventListener(CYIEvent::Type::ActionDown, this);
    pSceneManager->AddGlobalEventListener(CYIEvent::Type::ActionMove, this);
}

void InteractionModule::StopObserving()
{
    auto pSceneManager = CYIAppContext::GetInstance()->GetApp()->GetSceneManager();
    
    pSceneManager->RemoveGlobalEventListener(CYIEvent::Type::TrackpadMove, this);
    pSceneManager->RemoveGlobalEventListener(CYIEvent::Type::TrackpadUp, this);
    pSceneManager->RemoveGlobalEventListener(CYIEvent::Type::TrackpadDown, this);
    pSceneManager->RemoveGlobalEventListener(CYIEvent::Type::KeyUp, this);
    pSceneManager->RemoveGlobalEventListener(CYIEvent::Type::KeyDown, this);
    pSceneManager->RemoveGlobalEventListener(CYIEvent::Type::KeyInput, this);
    pSceneManager->RemoveGlobalEventListener(CYIEvent::Type::ActionUp, this);
    pSceneManager->RemoveGlobalEventListener(CYIEvent::Type::ActionDown, this);
    pSceneManager->RemoveGlobalEventListener(CYIEvent::Type::ActionMove, this);
}

bool InteractionModule::HandleEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent)
{
    YI_UNUSED(pDispatcher);
    YI_UNUSED(pEvent);

    folly::dynamic event = folly::dynamic::object;

    event["eventType"] = ToDynamic(pEvent->GetName().GetData());
    event["eventName"] = YI_INTERACTION_EVENT;
    
    EmitEvent(YI_INTERACTION_EVENT, event);

    YI_LOGD(LOG_TAG, "Event received: %s", pEvent->GetName().GetData());

    return false;
}
