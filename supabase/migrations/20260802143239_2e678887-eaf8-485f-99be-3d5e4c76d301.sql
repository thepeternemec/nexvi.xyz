REVOKE ALL ON FUNCTION public.has_active_subscription(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.get_tool_usage() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.consume_tool_credit(text, integer) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.get_tool_usage() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.consume_tool_credit(text, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.has_active_subscription(uuid) TO service_role;