using System.Web;
using System.Web.Mvc;

namespace com.vorwardit.wordsworthcms
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
