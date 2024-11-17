import { useLocation } from "@remix-run/react";
import { CommentCount, DiscussionEmbed } from "disqus-react";

interface DisqusCommentsProps {
  title: string;
  id: string;
}

const DisqusComments = ({ title, id }: DisqusCommentsProps) => {
  const location = useLocation();
  const disqusConfig = {
    url: `http://localhost:5173${location.pathname}`,
    identifier: id,
    title: title,
  };

  return (
    <div className="py-10">
      <DiscussionEmbed shortname="animex-10" config={disqusConfig} />
      <CommentCount shortname="animex-10" config={disqusConfig} />
    </div>
  );
};

export default DisqusComments;
