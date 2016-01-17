using com.vorwardit.wordsworthcms.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace com.vorwardit.wordsworthcms.BusinessLogic.Interfaces
{
    public interface ILayoutService
    {
        Task<Layout> GetAsync(Guid id);
        Task<Layout> GetOrCreateAsync(Guid id);
        Task<IList<Layout>> GetBySiteIdAsync(Guid siteId);

        Task UpdateAsync(Layout layout);
        Task DeleteAsync(Guid id);
    }
}
