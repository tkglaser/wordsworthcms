using com.vorwardit.wordsworthcms.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.vorwardit.wordsworthcms.BusinessLogic.Interfaces
{
    public interface ISiteService
    {
        Task<IList<Site>> GetAllAsync();
        Task<Site> GetByHostnameAsync(string hostname);
        Task<Site> GetAsync(Guid id);
        Task<Site> GetOrCreateAsync(Guid id);

        Task UpdateAsync(Site layout);
        Task DeleteAsync(Guid id);
    }
}
