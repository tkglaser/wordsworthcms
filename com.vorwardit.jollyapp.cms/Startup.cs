using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(com.vorwardit.jollyapp.cms.Startup))]
namespace com.vorwardit.jollyapp.cms
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
