import { getItem, setItem } from '../utils/storage.js';
import DocumentList from './DocumentList.js';
import { DOCUMENT_ISOEPN_LOCAL_KEY } from '../utils/constants.js';

export default function NavBar({ $container, initialState, onSelect, onAdd, onDelete }) {
  const $nav = document.createElement('nav');
  $nav.className = 'nav-bar';
  $container.appendChild($nav);

  this.state = initialState;

  const addIsOpenState = (documents, openDocuments) => {
    return documents.map((document) => ({
      ...document,
      documents: document.documents.length
        ? addIsOpenState(document.documents, openDocuments)
        : document.documents,
      isOpen: openDocuments.includes(document.id),
    }));
  };

  this.setState = (newState) => {
    const openDocuments = getItem(DOCUMENT_ISOEPN_LOCAL_KEY, []);
    this.state = addIsOpenState(newState, openDocuments);
    this.render();
  };

  this.render = () => {
    $nav.innerHTML = `
		<span class="nav-bar-title">๐ฅณ ์ํ์ Notion</span>
		<ul class="root-document">
			${DocumentList(this.state)}
		</ul>
		<button type="button" id="root-add">ํ์ด์ง ์ถ๊ฐํ๊ธฐ</button>
	`;
  };

  this.render();

  $nav.addEventListener('click', (e) => {
    if (e.target.id === 'root-add') {
      onAdd(null);
    }

    const $document = e.target.closest('li');
    if (!$document) return;

    const { id } = $document.dataset;
    if (!id) return;

    const idNumberType = Number(id);
    const eventType = e.target.id;
    switch (eventType) {
      case 'toggle':
        $document.childNodes.forEach((node) => {
          if (node.nodeName === 'UL') {
            node.classList.toggle('hide');

            const currentIsOpenState = getItem(DOCUMENT_ISOEPN_LOCAL_KEY, []);
            if (node.className === 'hide') {
              // ๋ซํ์ผ๋ฉด -> ๋ก์ปฌ์์ ๋นผ๊ธฐ
              const newIsOpenState = currentIsOpenState.filter(
                (documentId) => documentId !== idNumberType
              );
              setItem(DOCUMENT_ISOEPN_LOCAL_KEY, newIsOpenState);
            } else {
              // ์ด๋?ธ์ผ๋ฉด -> ๋ก์ปฌ์ ๋ฃ๊ธฐ
              setItem(DOCUMENT_ISOEPN_LOCAL_KEY, [...currentIsOpenState, idNumberType]);
            }
          }
        });
        e.target.classList.toggle('clicked');
        break;
      case 'add':
        setItem(DOCUMENT_ISOEPN_LOCAL_KEY, [
          ...getItem(DOCUMENT_ISOEPN_LOCAL_KEY, []),
          idNumberType,
        ]);
        onAdd(idNumberType);
        break;
      case 'delete':
        onDelete(idNumberType);
        break;
      default:
        onSelect(idNumberType);
    }
  });
}
